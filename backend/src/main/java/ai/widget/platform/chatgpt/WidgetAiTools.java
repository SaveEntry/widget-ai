package ai.widget.platform.chatgpt;

import ai.widget.poll.PollController;
import org.springframework.ai.mcp.annotation.McpTool;
import org.springframework.ai.mcp.annotation.McpToolParam;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Component
public class WidgetAiTools {
    private final PollController polls;

    public WidgetAiTools(PollController polls) {
        this.polls = polls;
    }

    @McpTool(
            name = "show_widgetai",
            description = "Show the latest active Widget.ai poll. Participation is optional; this demo awards no points or rewards.",
            generateOutputSchema = true,
            annotations = @McpTool.McpAnnotations(readOnlyHint = true, destructiveHint = false),
            metaProvider = WidgetAiUiMetadata.class)
    public WidgetPollResult showWidgetAi() {
        List<PollController.PollSummary> activePolls = polls.list();
        if (activePolls.isEmpty()) {
            return new WidgetPollResult(false, new WidgetPoll("", "", "", false, List.of(), 0, ""),
                    "There are no active polls right now.");
        }
        var active = activePolls.get(0);
        return new WidgetPollResult(true, WidgetPoll.from(polls.get(active.id(), null)),
                "Your participation is optional. This demo awards no points or rewards.");
    }

    @McpTool(
            name = "submit_widgetai_vote",
            description = "Submit the participant's selected choice for an active Widget.ai poll. The UI must obtain an explicit user click before calling this tool.",
            generateOutputSchema = true,
            metaProvider = WidgetAiUiMetadata.class)
    public WidgetPoll submitWidgetAiVote(
            @McpToolParam(description = "ID of the active poll", required = true) String pollId,
            @McpToolParam(description = "ID of the selected choice", required = true) String optionId,
            @McpToolParam(description = "Stable anonymous browser ID for duplicate-vote prevention", required = true) String voterId) {
        try {
            return WidgetPoll.from(polls.vote(UUID.fromString(pollId), new PollController.VoteRequest(
                    UUID.fromString(voterId), UUID.fromString(optionId))));
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST, "Poll, choice, or participant ID is invalid.");
        }
    }

    public record WidgetPollResult(boolean hasPoll, WidgetPoll poll, String message) {}

    public record WidgetPoll(String id, String question, String rewardDisclosure, boolean active,
                             List<WidgetPollOption> options, long totalVotes, String selectedOptionId) {
        private static WidgetPoll from(PollController.PollView poll) {
            return new WidgetPoll(poll.id().toString(), poll.question(), poll.rewardDisclosure(), poll.active(),
                    poll.options().stream().map(option -> new WidgetPollOption(option.id().toString(), option.label(), option.votes(), option.percent())).toList(),
                    poll.totalVotes(), poll.selectedOptionId() == null ? "" : poll.selectedOptionId().toString());
        }
    }

    public record WidgetPollOption(String id, String label, long votes, long percent) {}
}
