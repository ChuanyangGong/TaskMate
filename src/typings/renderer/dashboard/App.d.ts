import { Dispatch, SetStateAction } from "react";
import { Dayjs } from "dayjs";

export interface MenuItem {
  icon: string;
  iconColor: string;
  title: string;
  show: boolean;
  taskStatus: number,
}

export interface DefaultItemType {
  icon: string;
  title: string;
  id: string;
}

export interface FilterParamType {
  taskStatus: number,
  keyword: string,
  categoryId?: number,
  tagId?: number,
  dateRange: Dayjs[] | null,
  dateRangeString?: string[] | null,
}

export interface LoadTaskListFuncType {
  buttonList: MenuItem[];
  selectedTitle: string;
  loadTaskItems: (filterParam: FilterParamType, reload: boolean) => void;
  setFilterParam: Dispatch<SetStateAction<FilterParamType>>;
  filterParam: FilterParamType;
}

export interface selectedSubIdType {
  id: string;
  title: string;
}

export interface TimeSliceItemType {
  id: number | null;
  startAt: Date | null;
  endAt: Date | null;
  duration: number | null;
}

export interface TaskDetailItemType {
  id: number | null;
  title: string | null;
  detail: string | null;
  planStartAt: Date | null;
  planEndAt: Date | null;
  startAt: Date | null;
  endAt: Date | null;
  duration: number | null;
  status: number;
  categoryId: number | null;
  tagIds: number[] | null;
  updateTagList: boolean;
  updateTimeSliceList: boolean;
  timeSliceList: TimeSliceItemType[] | null;
}
