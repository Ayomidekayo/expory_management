import { useQuery } from "@tanstack/react-query";

import { getConsignees } from "../../api/consignee.api";

import { queryKeys } from "../../lib/queryKeys";



export function useConsignees(
  params?: ConsigneeQuery
) {
  return useQuery({
    queryKey: [
      ...queryKeys.consignees.all,
      params,
    ],

    queryFn: () =>
      getConsignees(params),
  });
}