"use client";

import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

const PostApp = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  const handleSubmit = async () => {
    const response = await fetch("http://127.0.0.1:5000/api/p", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content }),
    });
    const result = await response.json();
    console.log(result);
  };

  return (
    <div>
      <Input placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
      <Input
        placeholder="Content"
        onChange={(e) => setContent(e.target.value)}
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default PostApp;
