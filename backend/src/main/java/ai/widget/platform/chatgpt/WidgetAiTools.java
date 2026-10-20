package ai.widget.platform.chatgpt;

import org.springframework.ai.mcp.annotation.McpTool;
import org.springframework.ai.mcp.annotation.context.MetaProvider;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class WidgetAiTools {
    @McpTool(name = "show_widgetai", description = "Show an optional Widget.ai poll preview. This demo does not submit answers or award points.", metaProvider = WidgetAiUiMetadata.class)
    public WidgetActivityPreview showWidgetAi() {
        return new WidgetActivityPreview(
                "POLL",
                "Which laptop feature matters most to you?",
                List.of("Battery life", "Performance", "Repairability"),
                "Preview only. No response is stored and no WidgetPoints are issued.",
                true);
    }
}

