import type React from "react"

export const Chart = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>
}

export const ChartContainer = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>
}

export const ChartGrid = ({ x, y }: { x: boolean; y: boolean }) => {
  return null
}

export const ChartLine = ({
  data,
  valueKey,
  nameKey,
  stroke,
  strokeWidth,
}: { data: any[]; valueKey: string; nameKey: string; stroke: string; strokeWidth: number }) => {
  return null
}

export const ChartLineTooltip = () => {
  return null
}

export const ChartTooltip = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>
}

export const ChartTooltipContent = () => {
  return null
}

export const ChartXAxis = () => {
  return null
}

export const ChartYAxis = () => {
  return null
}

export const ChartBar = ({
  data,
  valueKey,
  nameKey,
  fill,
}: { data: any[]; valueKey: string; nameKey: string; fill: string }) => {
  return null
}
