// GENERATED by @edgedb/generate v0.3.3

import type {Executor} from "edgedb";

export type UpdateLearningStatusArgs = {
  "email": string;
  "globalTopicId": string;
};

export type UpdateLearningStatusReturns = {
  "id": string;
} | null;

export async function updateLearningStatus(client: Executor, args: UpdateLearningStatusArgs): Promise<UpdateLearningStatusReturns> {
  return client.querySingle(`\
update User
  filter .email = <str>$email
  set {
    topicsLearning += (select GlobalTopic filter .id = <uuid>$globalTopicId)
  }`, args);

}
