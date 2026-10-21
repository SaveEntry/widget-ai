package ai.widget.poll;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/polls")
public class PollController {
    public static final String NO_REWARDS_DISCLOSURE = "No rewards are issued in this demo.";
    private final JdbcTemplate jdbc;

    public PollController(JdbcTemplate jdbc) { this.jdbc = jdbc; }

    @GetMapping
    public List<PollSummary> list() {
        return jdbc.query("SELECT id, question FROM polls WHERE status='ACTIVE' ORDER BY created_at DESC",
                (rs, row) -> new PollSummary(rs.getObject("id", UUID.class), rs.getString("question"), NO_REWARDS_DISCLOSURE));
    }

    @GetMapping("/{pollId}")
    public PollView get(@PathVariable UUID pollId, @RequestParam(required = false) UUID voterId) {
        return load(pollId, voterId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    public PollView create(@RequestBody CreatePoll request) {
        if (request == null || request.question() == null || request.question().isBlank() || request.question().length() > 240)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Question must be 1 to 240 characters.");
        if (request.options() == null || request.options().size() < 2 || request.options().size() > 8)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Add between 2 and 8 choices.");
        var options = request.options().stream().map(s -> s == null ? "" : s.trim()).toList();
        if (options.stream().anyMatch(s -> s.isBlank() || s.length() > 120) || options.stream().map(String::toLowerCase).distinct().count() != options.size())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Choices must be unique and 1 to 120 characters.");
        UUID id = jdbc.queryForObject("INSERT INTO polls(question, reward_disclosure) VALUES (?, ?) RETURNING id",
                UUID.class, request.question().trim(), NO_REWARDS_DISCLOSURE);
        for (int i = 0; i < options.size(); i++)
            jdbc.update("INSERT INTO poll_options(poll_id, label, position) VALUES (?, ?, ?)", id, options.get(i), i);
        return load(id, null);
    }

    @PostMapping("/{pollId}/votes")
    @Transactional
    public PollView vote(@PathVariable UUID pollId, @RequestBody VoteRequest request) {
        if (request == null || request.voterId() == null || request.optionId() == null)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A voter and choice are required.");
        Integer exists = jdbc.queryForObject("SELECT count(*) FROM poll_options WHERE id=? AND poll_id=?", Integer.class, request.optionId(), pollId);
        if (exists == null || exists == 0) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "That choice does not belong to this poll.");
        try {
            int inserted = jdbc.update("INSERT INTO poll_votes(poll_id, option_id, voter_id) SELECT ?, ?, ? WHERE EXISTS (SELECT 1 FROM polls WHERE id=? AND status='ACTIVE')",
                    pollId, request.optionId(), request.voterId(), pollId);
            if (inserted == 0) throw new ResponseStatusException(HttpStatus.CONFLICT, "This poll is closed.");
        } catch (DataIntegrityViolationException e) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "You have already voted in this poll.");
        }
        return load(pollId, request.voterId());
    }

    private PollView load(UUID pollId, UUID voterId) {
        var rows = jdbc.query("SELECT p.question, p.status, o.id option_id, o.label, count(v.id) votes " +
                "FROM polls p JOIN poll_options o ON o.poll_id=p.id LEFT JOIN poll_votes v ON v.option_id=o.id " +
                "WHERE p.id=? GROUP BY p.id, o.id ORDER BY o.position", (rs, row) -> new OptionResult(
                rs.getObject("option_id", UUID.class), rs.getString("label"), rs.getLong("votes"),
                rs.getString("question"), rs.getString("status")), pollId);
        if (rows.isEmpty()) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Poll not found.");
        var first = rows.get(0);
        UUID selected = null;
        if (voterId != null) {
            var found = jdbc.query("SELECT option_id FROM poll_votes WHERE poll_id=? AND voter_id=?", (rs, row) -> rs.getObject(1, UUID.class), pollId, voterId);
            if (!found.isEmpty()) selected = found.get(0);
        }
        long total = rows.stream().mapToLong(OptionResult::votes).sum();
        var options = rows.stream().map(r -> new PollOption(r.id(), r.label(), r.votes(), total == 0 ? 0 : Math.round(100.0 * r.votes() / total))).toList();
        return new PollView(pollId, first.question(), NO_REWARDS_DISCLOSURE, first.status().equals("ACTIVE"), options, total, selected);
    }

    public record CreatePoll(String question, List<String> options, String rewardDisclosure) {}
    public record VoteRequest(UUID voterId, UUID optionId) {}
    public record PollSummary(UUID id, String question, String rewardDisclosure) {}
    public record PollOption(UUID id, String label, long votes, long percent) {}
    public record PollView(UUID id, String question, String rewardDisclosure, boolean active, List<PollOption> options, long totalVotes, UUID selectedOptionId) {}
    private record OptionResult(UUID id, String label, long votes, String question, String status) {}
}
