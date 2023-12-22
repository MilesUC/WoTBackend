import { Construct } from "constructs";

export class BaseService {
  scope: Construct;
  stageId: string;

  constructor(scope: Construct, stageId: string) {
    this.scope = scope;
    this.stageId = stageId;
  }

  getServiceId(service: string) {
    return `${this.stageId}-${service}`;
  }
}
