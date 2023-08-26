'use client';

import { CounterClockwiseClockIcon } from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

import { useChat } from '@axflow/models/react';
import type { MessageType } from '@axflow/models/shared';

const API_URL = '/api/openai/chat';

export default function Playground() {
  const { input, onChange, onSubmit, messages } = useChat({ url: API_URL });

  return (
    <div className="pt-[52px]">
      <div className="flex justify-center gap-8">
        <Form input={input} onChange={onChange} onSubmit={onSubmit} />
        <Messages messages={messages} />
      </div>
    </div>
  );
}

type FormPropsType = {
  input: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

function Form(props: FormPropsType) {
  return (
    <section>
      <form onSubmit={props.onSubmit}>
        <div className="h-[600px] w-[500px]">
          <Textarea
            className="h-full"
            placeholder="Enter message here"
            value={props.input}
            onChange={props.onChange}
          ></Textarea>
        </div>
        <div className="flex items-center space-x-2 pt-4">
          <Button type="submit">Submit</Button>
          <Button variant="secondary">
            <span className="sr-only">Show history</span>
            <CounterClockwiseClockIcon className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </section>
  );
}

function Messages(props: { messages: MessageType[] }) {
  return (
    <section>
      <div className="h-[600px] w-[500px] bg-muted bg-zinc-900 text-sm px-3 py-2 rounded space-y-4">
        {props.messages.map((msg) => (
          <p key={msg.id}>
            {msg.data && (
              <span className="block mt-2 text-xs">Has {msg.data.length} data items</span>
            )}
            {msg.content}
          </p>
        ))}
      </div>
    </section>
  );
}
