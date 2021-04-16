import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Controller } from '@nestjs/common';
import { CheckoutOrderEvent, CheckoutOrderPayload, UserCreatedEvent, UserCreatedPayload } from '@vaagnavanesyan/common';
import { Queues } from 'src/constants';
import { User } from 'src/entities/user.entity';
import { nameof } from 'ts-simple-nameof';
import { getRepository } from 'typeorm';

@Controller()
export class BillingHandler {
  @RabbitSubscribe({
    exchange: 'amq.direct',
    routingKey: nameof(UserCreatedEvent),
    queue: Queues.UsersQueue,
  })
  public async handleUserCreated(data: UserCreatedPayload) {
    console.log(data);
    const repo = getRepository(User);
    await repo.save(data);
  }

  @RabbitSubscribe({
    exchange: 'amq.direct',
    routingKey: nameof(CheckoutOrderEvent),
    queue: Queues.OrdersQueue,
  })
  public async handleCheckoutOrder(data: CheckoutOrderPayload) {
    console.log(data);
  }
}
