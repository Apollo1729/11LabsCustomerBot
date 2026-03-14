import { AGENT_ID } from '../constants.ts';
import { client } from './11labs.ts';
import { prompt } from '../prompt.ts';

async function updateAgent() {
  console.log('Updating agent...');
  const result = await client.conversationalAi.agents.update(AGENT_ID, {
    name: 'Pasquale Updated!',
    platformSettings: {
      dataCollection: {
        price: {
          type: 'number',
          description: 'The price of a dozen pastries with three flavors',
        },
        recommendedToppings: {
          type: 'string',
          description: 'A comma separated list of the recommended flavors',
        },
        deliveryTime: {
          type: 'string',
          description: 'approximate time the bakery order will be delivered',
        }
      }
    },
    conversationConfig: {
      agent: {
        prompt: {
          prompt: prompt,
        }
      }
    }
  });
  console.log(result);
}

updateAgent();
