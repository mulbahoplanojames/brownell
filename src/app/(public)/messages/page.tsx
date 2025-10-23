"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState("1");
  const [messageText, setMessageText] = useState("");

  const conversations = [
    {
      id: "1",
      name: "Golden Paws Kennel",
      avatar: "/professional-dog-breeder.jpg",
      lastMessage: "The puppy is ready for pickup this weekend",
      timestamp: "2 hours ago",
      unread: 2,
      puppyName: "Max",
    },
    {
      id: "2",
      name: "Happy Tails Breeding",
      avatar: "/family-dog-breeder.jpg",
      lastMessage: "Thank you for your interest!",
      timestamp: "1 day ago",
      unread: 0,
      puppyName: "Luna",
    },
  ];

  const messages = [
    {
      id: "1",
      senderId: "breeder",
      content:
        "Hello! Thank you for your interest in Max. He's a wonderful puppy!",
      timestamp: "10:30 AM",
    },
    {
      id: "2",
      senderId: "user",
      content: "Hi! I'd love to learn more about Max. Is he still available?",
      timestamp: "10:35 AM",
    },
    {
      id: "3",
      senderId: "breeder",
      content: "Yes, he is! Would you like to schedule a visit to meet him?",
      timestamp: "10:40 AM",
    },
    {
      id: "4",
      senderId: "user",
      content: "That would be great! What times work for you this weekend?",
      timestamp: "10:45 AM",
    },
    {
      id: "5",
      senderId: "breeder",
      content:
        "The puppy is ready for pickup this weekend. Saturday or Sunday afternoon works best for us.",
      timestamp: "11:00 AM",
    },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim()) {
      // Send message logic here
      setMessageText("");
    }
  };

  const selectedConv = conversations.find((c) => c.id === selectedConversation);

  return (
    <main className="bg-muted/50">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Messages</h1>

        <Card className="overflow-hidden">
          <div className="grid md:grid-cols-3 h-[600px]">
            {/* Conversations List */}
            <div className="border-r">
              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search conversations..."
                    className="pl-9"
                  />
                </div>
              </div>

              <ScrollArea className="h-[calc(600px-73px)]">
                <div className="divide-y">
                  {conversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation.id)}
                      className={`w-full p-4 text-left hover:bg-muted/50 transition-colors ${
                        selectedConversation === conversation.id
                          ? "bg-muted"
                          : ""
                      }`}
                    >
                      <div className="flex gap-3">
                        <Avatar>
                          <AvatarImage
                            src={conversation.avatar || "/placeholder.svg"}
                            alt={conversation.name}
                          />
                          <AvatarFallback>
                            {conversation.name[0]}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <p className="font-semibold text-sm truncate">
                              {conversation.name}
                            </p>
                            {conversation.unread > 0 && (
                              <Badge
                                variant="default"
                                className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                              >
                                {conversation.unread}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Re: {conversation.puppyName}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {conversation.lastMessage}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {conversation.timestamp}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Chat Area */}
            <div className="md:col-span-2 flex flex-col">
              {selectedConv ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={selectedConv.avatar || "/placeholder.svg"}
                        alt={selectedConv.name}
                      />
                      <AvatarFallback>{selectedConv.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{selectedConv.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Regarding: {selectedConv.puppyName}
                      </p>
                    </div>
                  </div>

                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.senderId === "user"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                              message.senderId === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p
                              className={`text-xs mt-1 ${
                                message.senderId === "user"
                                  ? "text-primary-foreground/70"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {message.timestamp}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* Message Input */}
                  <form onSubmit={handleSendMessage} className="p-4 border-t">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type a message..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        className="flex-1"
                      />
                      <Button type="submit" size="icon">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  Select a conversation to start messaging
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
