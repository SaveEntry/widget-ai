package ai.widget.platform.chatgpt;

import ai.widget.poll.PollController;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class WidgetAiToolsTest {
    @Test
    void returnsTheLatestActivePollForTheWidget() {
        var controller = mock(PollController.class);
        var pollId = UUID.randomUUID();
        var summary = new PollController.PollSummary(pollId, "Which feature matters most?", "No rewards.");
        var poll = new PollController.PollView(pollId, summary.question(), summary.rewardDisclosure(), true,
                List.of(new PollController.PollOption(UUID.randomUUID(), "Battery", 3, 100)), 3, null);
        when(controller.list()).thenReturn(List.of(summary));
        when(controller.get(pollId, null)).thenReturn(poll);

        var result = new WidgetAiTools(controller).showWidgetAi();

        assertThat(result.hasPoll()).isTrue();
        assertThat(result.poll().question()).isEqualTo(poll.question());
        assertThat(result.poll().options()).extracting(WidgetAiTools.WidgetPollOption::label).containsExactly("Battery");
        assertThat(result.message()).contains("optional").contains("No points");
    }

    @Test
    void explainsWhenNoActivePollExists() {
        var controller = mock(PollController.class);
        when(controller.list()).thenReturn(List.of());

        var result = new WidgetAiTools(controller).showWidgetAi();

        assertThat(result.hasPoll()).isFalse();
        assertThat(result.poll().question()).isEmpty();
        assertThat(result.message()).contains("no active polls");
    }
}
