"use client";

import { useState } from "react";

type RefundStatus = "not_refunded" | "partial_refund" | "full_refund";

export function RefundStatusForm({
  action,
  orderTotal,
  refundAmount,
  refundStatus,
}: {
  action: string;
  orderTotal: number;
  refundAmount: number | null;
  refundStatus: string;
}) {
  const [status, setStatus] = useState<RefundStatus>(
    isRefundStatus(refundStatus) ? refundStatus : "not_refunded",
  );

  return (
    <form
      action={action}
      className="admin-card flex flex-wrap items-end gap-3 p-4"
      method="post"
      onSubmit={(event) => {
        if (status === "not_refunded") return;

        const label = status === "full_refund" ? "full refund" : "partial refund";
        const ok = window.confirm(`Confirm ${label} for this order?`);

        if (!ok) event.preventDefault();
      }}
    >
      <input name="order_total" type="hidden" value={orderTotal} />
      <label className="grid gap-2 font-semibold">
        Refund status
        <select
          className="admin-input capitalize"
          name="refund_status"
          onChange={(event) => setStatus(event.target.value as RefundStatus)}
          value={status}
        >
          <option value="not_refunded">No refund</option>
          <option value="full_refund">Full refund</option>
          <option value="partial_refund">Partial refund</option>
        </select>
      </label>

      {status === "partial_refund" ? (
        <label className="grid gap-2 font-semibold">
          Refund amount
          <input
            className="admin-input"
            defaultValue={refundAmount ?? ""}
            min="0.01"
            name="refund_amount"
            required
            step="0.01"
            type="number"
          />
        </label>
      ) : null}

      <button className="admin-action px-4 py-2.5" type="submit">
        Update refund
      </button>
    </form>
  );
}

function isRefundStatus(value: string): value is RefundStatus {
  return value === "not_refunded" || value === "partial_refund" || value === "full_refund";
}
