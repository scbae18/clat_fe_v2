export type AdminSession = {
  user_id: number
  name: string
  email: string
}

export type AdminMeta = {
  page: number
  limit: number
  total: number
}

export type AdminDashboard = {
  generated_at: string
  kpis: {
    total_users: number
    withdrawal_users: number
    active_users_7d: number
    total_classes: number
    active_classes: number
    ended_classes: number
    total_students: number
    total_lessons: number
    today_lessons: number
  }
  wow: {
    lessons: { label: string; pct: number }
    signups: { label: string; pct: number }
    this_week_lessons: number
    last_week_lessons: number
    this_week_signups: number
    last_week_signups: number
  }
  funnel: Array<{ label: string; count: number }>
  signup_daily: Array<{ date: string; value: number }>
  lesson_daily: Array<{ date: string; value: number }>
  dow: Array<{ label: string; value: number }>
  top_teachers: Array<{ id: number; name: string; lesson_count: number }>
  recent_feed: Array<{
    id: number
    lesson_date: string
    created_at: string
    is_adhoc: boolean
    class_name: string
    teacher_id: number
    teacher_name: string
    template_name: string
  }>
}

export type AdminUserListItem = {
  id: number
  email: string
  name: string
  created_at: string
  withdrawal_requested_at: string | null
  class_count: number
  student_count: number
  template_count: number
  last_lesson_at: string | null
  is_active_7d: boolean
  is_inactive_14d: boolean
}

export type AdminUserList = {
  summary: {
    total: number
    active_7d: number
    inactive_14d: number
    withdrawal: number
  }
  items: AdminUserListItem[]
  meta: AdminMeta
}

export type AdminUserDetail = {
  id: number
  email: string
  name: string
  created_at: string
  withdrawal_requested_at: string | null
  is_active_7d: boolean
  last_lesson_at: string | null
  stats: {
    class_count: number
    active_class_count: number
    student_count: number
    template_count: number
    lesson_count: number
    adhoc_lesson_count: number
  }
  lesson_daily: Array<{ date: string; value: number }>
  classes: Array<{
    id: number
    name: string
    academy_name: string
    ended_at: string | null
    created_at: string
    student_count: number
    lesson_count: number
    days_of_week: number[]
  }>
  students: Array<{
    id: number
    name: string
    school_name: string | null
    created_at: string
    classes: string[]
  }>
  templates: Array<{
    id: number
    name: string
    created_at: string
    item_count: number
    lesson_count: number
  }>
  recent_lessons: Array<{
    id: number
    lesson_date: string
    created_at: string
    is_adhoc: boolean
    class_name: string
    template_name: string
  }>
}

export type AdminCreatedUser = {
  id: number
  email: string
  name: string
  created_at: string
}

export type AdminClassList = {
  summary: {
    active: number
    ended: number
    student_total: number
    avg_students: number
  }
  items: Array<{
    id: number
    name: string
    academy_name: string
    ended_at: string | null
    created_at: string
    teacher_id: number
    teacher_name: string
    teacher_email: string
    student_count: number
    lesson_count: number
    days_of_week: number[]
  }>
  meta: AdminMeta
}

export type AdminLessonList = {
  summary: {
    total: number
    adhoc: number
    adhoc_rate: number
    last_30d: number
  }
  template_usage: Array<{ id: number; name: string; lesson_count: number }>
  items: Array<{
    id: number
    lesson_date: string
    created_at: string
    is_adhoc: boolean
    class_name: string
    teacher_id: number
    teacher_name: string
    template_id: number
    template_name: string
  }>
  meta: AdminMeta
}

export type AdminAlimtalkStatus = 'all' | 'SUCCESS' | 'FAIL'

export type AdminAlimtalkList = {
  summary: { total: number; success: number; fail: number }
  items: Array<{
    message_id: number
    status: string
    phone: string
    phone_type: string
    message_preview: string
    error_message: string | null
    batch_id: number
    batch_type: string
    delivery_mode: string
    sent_at: string
    total_count: number
    success_count: number
    fail_count: number
    teacher_id: number
    teacher_name: string
    teacher_email: string
    student_name: string
    class_name: string | null
    template_name: string | null
    lesson_date: string | null
  }>
  meta: AdminMeta
}

export type AdminHealth = {
  generated_at: string
  info: {
    total_users: number
    new_users_30d: number
    withdrawal_users: number
  }
  checks: Array<{
    key: string
    label: string
    description: string
    status: 'ok' | 'warn' | 'error' | 'info'
    count: number
    samples: Array<Record<string, string | number | null>>
  }>
}
