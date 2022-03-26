import type { proto } from '~/proto/messages';
import type { Any } from '~/proto/messages/google/protobuf';
import type { MessageType } from '~/proto/messages/proto';

type ProtoMessage = {
  type: MessageType,
  data?: Any,
  error?: number,
};

