package ai.widget.platform.chatgpt;

import org.springframework.ai.mcp.annotation.context.MetaProvider;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class WidgetAiResourceMetadata implements MetaProvider {
    @Override
    public Map<String, Object> getMeta() {
        return Map.of(
                "ui", Map.of("prefersBorder", true),
                "openai/widgetDescription", "An optional poll. Select one choice and submit to see the results.",
                "openai/ui", Map.of("availableDisplayModes", List.of("inline", "fullscreen")));
    }
}
