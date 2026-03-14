import { Voice } from "./Voice.tsx";
import { Conversations } from "./Conversations.tsx";
import { ConversationDetail } from "./ConversationDetail.tsx";
import { OutboundCall } from "./OutboundCall.tsx";

export function App(props: { url: URL }) {
  const pathname = props.url.pathname;

  // Parse route
  const conversationMatch = pathname.match(/^\/conversations\/(.+)$/);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <div className="border-b border-gray-200 bg-white">
        <nav className="max-w-4xl mx-auto px-6 py-4">
          <a
            href="/"
            className="text-xl font-semibold text-gray-900 hover:text-gray-600 transition-colors"
          >
            Pasquale the Bakery Agent
          </a>
        </nav>
      </div>

      {/* Route Content */}
      {conversationMatch ? (
        <ConversationDetail conversationId={conversationMatch[1]} />
      ) : (
        <div className="container mx-auto p-6">
          <div className="space-y-6">
            <Voice />
            <OutboundCall />
            <Conversations />
          </div>
        </div>
      )}
    </div>
  );
}
