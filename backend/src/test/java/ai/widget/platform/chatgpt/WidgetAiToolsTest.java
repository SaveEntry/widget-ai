package ai.widget.platform.chatgpt;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class WidgetAiToolsTest {
    private final WidgetAiTools tools = new WidgetAiTools();

    @Test
    void returnsOptionalPreviewWithoutOfferingRewardOrSubmission() {
        var preview = tools.showWidgetAi();

        assertThat(preview.activityType()).isEqualTo("POLL");
        assertThat(preview.options()).containsExactly("Battery life", "Performance", "Repairability");
        assertThat(preview.previewOnly()).isTrue();
        assertThat(preview.rewardDisclosure()).contains("No response is stored", "no WidgetPoints");
    }
}

