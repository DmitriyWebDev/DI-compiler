import { TS } from "../../../type/type";
import { AfterVisitorOptions } from "../after-visitor-options";
import { visitRootBlock } from "./visit-root-block";

export function visitRootBlockBlock(
  options: AfterVisitorOptions<TS.Block>
): TS.VisitResult<TS.Node> {
  const { node, context } = options;
  const { typescript } = context;

  return typescript.updateBlock(node, visitRootBlock(options));
}
