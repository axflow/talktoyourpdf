import { cn } from '@/lib/client-utils';

import type { MessageType } from '@/lib/message';

function ChatMessage(props: { message: MessageType }) {
  const message = props.message;

  const shared = 'whitespace-pre-wrap w-fit max-w-[90%] rounded-lg px-3 py-2 text-md space-y-4';
  const distinct = message.user ? 'ml-auto bg-primary text-primary-foreground' : 'bg-muted';

  return <div className={cn(shared, distinct)}>{message.text}</div>;
}

type PropsType = {
  messages: MessageType[];
};

export function ChatMessages(props: PropsType) {
  const messages = props.messages;

  return (
    <div className="px-8 pb-4 space-y-4 max-w-full overflow-y-scroll">
      {messages.map((msg) => {
        return <ChatMessage key={msg.id} message={msg} />;
      })}
    </div>
  );
}
