import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Order } from 'src/orders/entities';
import { OrderStatuses } from 'src/orders/enums/order-statuses.enum';
import { OrderModel } from 'src/orders/models/order.model';
import { getRepository } from 'typeorm';
import { CheckoutOrderCommand } from '../impl/checkout-order.command';

@CommandHandler(CheckoutOrderCommand)
export class CheckoutOrderHandler
  implements ICommandHandler<CheckoutOrderCommand> {
  constructor(private readonly publisher: EventPublisher) {}

  async execute({ payload }: CheckoutOrderCommand) {
    const repo = getRepository(Order);
    const order = await repo.findOneOrFail(payload.orderId);

    if (
      order.status !== OrderStatuses.Active &&
      order.status !== OrderStatuses.PaymentDeclined
    ) {
      throw new BadRequestException(
        `Order with status: ${order.status} couldn't be passed to checkout`,
      );
    }

    if (order.ownerId !== payload.ownerId) {
      throw new ForbiddenException('Only owner can checkout this order');
    }

    order.status = OrderStatuses.Checkout;
    order.save();

    const orderModel = this.publisher.mergeObjectContext(
      new OrderModel(order.id),
    );

    orderModel.checkoutOrder(order.price, payload.ownerEmail);
    orderModel.commit();
  }
}
