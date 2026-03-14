import type { ConversationSummaryResponseModel } from "@elevenlabs/elevenlabs-js/api";
import { AGENT_ID } from "../constants";
import { client } from "./11labs";

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatDate(unixSecs: number) {
  const date = new Date(unixSecs * 1000);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

function Conversation({
  conversation,
}: {
  conversation: ConversationSummaryResponseModel;
}) {
  const statusConfig: Record<string, { bg: string, text: string, label: string }> = {
    done: { bg: 'bg-green-50', text: 'text-green-700', label: 'Completed' },
    in_progress: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'In Progress' },
    failed: { bg: 'bg-red-50', text: 'text-red-700', label: 'Failed' },
  };

  const currentStatus = statusConfig[conversation.status] || { bg: 'bg-gray-50', text: 'text-gray-700', label: conversation.status };

  return (
    <a
      href={`/conversations/${conversation.conversationId}`}
      className="block border border-gray-200 rounded-lg p-6 bg-white hover:border-gray-300 transition-colors"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {conversation.callSummaryTitle || 'Untitled Call'}
          </h3>
          <p className="text-xs text-gray-500">
            {formatDate(conversation.startTimeUnixSecs)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded text-xs font-medium border ${currentStatus.bg} ${currentStatus.text}`}>
            {currentStatus.label}
          </span>
          {conversation.callSuccessful && (
            <span className={`px-2 py-1 rounded text-xs font-medium border ${
              conversation.callSuccessful === 'success'
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-red-50 text-red-700 border-red-200'
            }`}>
              {conversation.callSuccessful}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-50 rounded p-3 border border-gray-200">
          <div className="text-xs text-gray-500 font-medium mb-1">Duration</div>
          <div className="text-base font-semibold text-gray-900">
            {formatDuration(conversation.callDurationSecs)}
          </div>
        </div>
        <div className="bg-gray-50 rounded p-3 border border-gray-200">
          <div className="text-xs text-gray-500 font-medium mb-1">Messages</div>
          <div className="text-base font-semibold text-gray-900">
            {conversation.messageCount}
          </div>
        </div>
      </div>

      {conversation.transcriptSummary && (
        <div className="p-3 bg-gray-50 rounded border border-gray-200">
          <p className="text-xs text-gray-700 line-clamp-2">{conversation.transcriptSummary}</p>
        </div>
      )}
    </a>
  );
}

export async function Conversations() {
  const conversations = await client.conversationalAi.conversations.list({
    agentId: AGENT_ID,
  });

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Conversations</h2>
      <div className="space-y-3">
        {conversations.conversations.map((conversation) => (
          <Conversation key={conversation.conversationId} conversation={conversation} />
        ))}
      </div>
    </div>
  );
}
