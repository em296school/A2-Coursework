'use client';

import { BooleanOption } from './BooleanOption';
import { Error } from './Error';
import { StringOption } from './StringOption';
import { Submit } from './Submit';
import { SubmitMyself } from './SubmitMyself';

function Selector({ children }: { children: React.ReactElement[] }) {
  return <div className="flex flex-col gap-4 w-full h-fit">{children}</div>;
}

Selector.StringOption = StringOption;
Selector.BooleanOption = BooleanOption;
Selector.Submit = Submit;
Selector.SubmitMyself = SubmitMyself;
Selector.Error = Error;

export default Selector;
