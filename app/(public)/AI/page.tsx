"use client";

import { useState } from "react";
import NavPane from "../../../_components/NavPane";
import CardContent from "../../../_components/CardContent";
import { relative } from "path";

export default function AI() {
    const [messages, setMessages] = useState<{ role: string, content: string }[]>([]);
    const [input, setInput] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const userMsg = { role: "user", content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");

        const res = await fetch("/api/groqAPI", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userMessage: input })
        });

        if (!res.ok) {
            const text = await res.text();
            console.error("API error:", text);
            return;
        }

        const { reply } = await res.json();
        setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <div style={{ padding: '3px' }}>
                <NavPane />
            </div>

            <div style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
                {/* Left sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', width: '250px' }}>
                    <CardContent className="flex-1">
                        <h1>Sidebar</h1>
                    </CardContent>
                </div>

                {/* Main content */}
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, position: 'relative' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <CardContent className="flex-1">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', maxHeight: '65vh', padding: '8px' }}>
                                {messages.map((m, i) => (
                                    <div key={i} style={{
                                        display: 'flex',
                                        flexDirection: m.role === 'user' ? 'row-reverse' : 'row',
                                        alignItems: 'flex-start',
                                        gap: '10px'
                                    }}>
                                        {/* Avatar */}
                                        <div style={{
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: '50%',
                                            backgroundColor: m.role === 'user' ? '#7bff00' : '#9b59b6',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0,
                                            overflow: 'hidden' // keeps the gif inside the circle
                                        }}>
                                            <img src="avatar.gif" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>

                                        {/* Bubble */}
                                        <div style={{
                                            backgroundColor: m.role === 'user' ? '#1bc71bce' : 'rgba(155,89,182,0.2)',
                                            borderRadius: '12px',
                                            padding: '10px 14px',
                                            maxWidth: '70%',
                                        }}>
                                            {m.content}
                                        </div>
                                    </div>
                                ))}
                            <div style={{ position: 'absolute', bottom: '7vh', left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
                                <div style={{ height: 60 }}>
                                    <CardContent>
                                        <form onSubmit={handleSubmit}>
                                            <input
                                                style={{ border: '2px solid #282828', borderRadius: '5px' }}
                                                placeholder=" Type Something Here..."
                                                type="text"
                                                value={input}
                                                onChange={(e) => setInput(e.target.value)}
                                            />
                                            {"     "}
                                            <input
                                                style={{ border: '2px solid #282828', borderRadius: '50px' }}
                                                type="submit" 
                                                value=" → " 
                                            />
                                        </form>
                                    </CardContent>
                                </div>
                            </div>
                            </div>
                        </CardContent>
                    </div>
                </div>
            </div>
        </div>
    );
}