package ai.widget.platform.chatgpt;

import org.springframework.ai.mcp.annotation.context.MetaProvider;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class WidgetAiUiMetadata implements MetaProvider {
    @Override
    public Map<String, Object> getMeta() {
        return Map.of("ui", Map.of("resourceUri", "ui://widget-ai/activity-v1.html"));
    }
}

