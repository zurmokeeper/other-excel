import { z } from 'zod';
import {MAX_ROW_NUM, MAX_COL_NUM} from './enum';



// 定义 Zod 模式并自定义错误消息
export const getRowsSchema = z.object({
  start: z.number()
    .int({ message: 'start must be an integer.' })
    .nonnegative({ message: 'start must be greater than or equal to 0.' }),
  end: z.number()
    .int({ message: 'end must be an integer.' })
    .nonnegative({ message: 'end must be greater than or equal to 0.' }),
}).refine(data => data.start < data.end, {
  message: 'start must be less than end.',
}).refine(data => data.end <= MAX_COL_NUM, {
  message: `end must be less than or equal to ${MAX_COL_NUM}.`,
});