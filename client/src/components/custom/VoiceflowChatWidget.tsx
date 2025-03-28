"use client";

import { useEffect } from "react";

export default function VoiceflowChatWidget() {
    useEffect(() => {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://cdn.voiceflow.com/widget-next/bundle.mjs";
        script.onload = () => {
            (window as any).voiceflow.chat.load({
                verify: { projectID: process.env.NEXT_PUBLIC_AI_CHATBOX_PROJECT_ID },
                url: "https://general-runtime.voiceflow.com",
                versionID: "production",
                voice: {
                    url: "https://runtime-api.voiceflow.com"
                }
            });
        };
        console.log('process.env.AI_CHATBOX_PROJECT_ID ', process.env.NEXT_PUBLIC_AI_CHATBOX_PROJECT_ID);

        document.body.appendChild(script);

        return () => {
            // Optional cleanup if needed
        };
    }, []);

    return null;
}
