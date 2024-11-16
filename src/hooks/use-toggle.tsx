import { useState } from "react";

export default function useToggle(initial: 0 | 1) {
  const [value, setValue] = useState(initial);

  function toggle(value?: 0 | 1) {
    setValue((x) => (value ? value : (Number(!Boolean(x)) as 0 | 1)));
  }

  return { value, toggle };
}
