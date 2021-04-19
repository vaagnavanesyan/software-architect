import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CheckoutOrderEvent,
  CheckoutOrderPayload,
  PaymentProceedEvent,
  PaymentProceedPayload,
  PaymentRefusedEvent,
  PaymentRefusedPayload,
  RabbitMQDirectExchange,
  UserCreatedEvent,
  UserCreatedPayload,
} from '@vaagnavanesyan/common';
import { Queues } from 'src/constants';
import { User } from 'src/entities/user.entity';
import { nameof } from 'ts-simple-nameof';
import { getRepository } from 'typeorm';

@Injectable()
export class BillingHandler {
  constructor(private readonly queue: AmqpConnection) {}

  @RabbitSubscribe({ exchange: RabbitMQDirectExchange, routingKey: nameof(UserCreatedEvent), queue: Queues.UsersQueue })
  public async handleUserCreated(data: UserCreatedPayload) {
    getRepository(User).save(data);
  }

  @RabbitSubscribe({
    exchange: RabbitMQDirectExchange,
    routingKey: nameof(CheckoutOrderEvent),
    queue: Queues.OrdersQueue,
  })
  public async handleCheckoutOrder({ email, orderId, price }: CheckoutOrderPayload) {
    const repo = getRepository(User);
    const user = await repo.findOne({ email });
    if (!user) {
      //todo: I'm not sure that its ok, better to log it and maybe send smth back
      throw new NotFoundException();
    }
    const { firstName, lastName } = user;

    if (user.amount >= price) {
      user.amount -= price;
      await user.save();
      const payload: PaymentProceedPayload = {
        orderId,
        price,
        payerEmail: email,
        firstName,
        lastName,
        payedAt: new Date(),
      };
      this.queue.publish(RabbitMQDirectExchange, nameof(PaymentProceedEvent), payload);
    } else {
      const payload: PaymentRefusedPayload = {
        amount: user.amount,
        orderId,
        price,
        payerEmail: email,
        firstName,
        lastName,
        refusedAt: new Date(),
      };
      this.queue.publish(RabbitMQDirectExchange, nameof(PaymentRefusedEvent), payload);
    }
  }
}
