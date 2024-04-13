import { Injectable } from '@nestjs/common';
import { Policy } from './interfaces/policy.interface';
import { PolicyHandler } from './interfaces/policy-handler.interfaces';
import { PolicyHandlerStorage } from './policy-handlers.storage';
import { ActiveUserData } from '../../interfaces/active-user-data.interface';

@Injectable()
export class FrameworkContributorPolicy implements Policy {
  name = 'FrameworkContributor';
}
@Injectable()
export class FrameworkContributorPolicyHandler
  implements PolicyHandler<FrameworkContributorPolicy>
{
  constructor(private readonly policyHandlerStorage: PolicyHandlerStorage) {
    this.policyHandlerStorage.add(FrameworkContributorPolicy, this);
  }

  async handle(
    policy: FrameworkContributorPolicy,
    user: ActiveUserData,
  ): Promise<void> {
    const isContributor = user.email.endsWith('@gmail.com');
    if (!isContributor) {
      throw new Error('User is not a contributor');
    }
  }
}
