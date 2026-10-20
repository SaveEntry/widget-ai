package ai.widget.platform.chatgpt;

import org.springframework.ai.mcp.annotation.McpResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Component
public class WidgetAiResource {
    private final Resource widget;

    public WidgetAiResource(org.springframework.core.io.ResourceLoader resourceLoader) {
        this.widget = resourceLoader.getResource("classpath:/static/widget-ai-activity-v1.html");
    }

    @McpResource(
            uri = "ui://widget-ai/activity-v1.html",
            name = "Widget.ai activity preview",
            description = "A preview-only Widget.ai poll card.",
            mimeType = "text/html;profile=mcp-app")
    public String activityWidget() throws IOException {
        try (var input = widget.getInputStream()) {
            return new String(input.readAllBytes(), StandardCharsets.UTF_8);
        }
    }
}

