import type { AgenticaUserMessageAudioContent } from "./AgenticaUserMessageAudioContent";
import type { AgenticaUserMessageFileContent } from "./AgenticaUserMessageFileContent";
import type { AgenticaUserMessageImageContent } from "./AgenticaUserMessageImageContent";
import type { AgenticaUserMessageTextContent } from "./AgenticaUserMessageTextContent";
export type AgenticaUserMessageContent = AgenticaUserMessageAudioContent | AgenticaUserMessageFileContent | AgenticaUserMessageImageContent | AgenticaUserMessageTextContent;
export declare namespace AgenticaUserMessageContent {
    type Type = AgenticaUserMessageContent["type"];
    interface Mapper {
        audio: AgenticaUserMessageAudioContent;
        file: AgenticaUserMessageFileContent;
        image: AgenticaUserMessageImageContent;
        text: AgenticaUserMessageTextContent;
    }
}
