import SimpleCrud from './SimpleCrud'

export default function SkillsAdmin() {
  return (
    <SimpleCrud
      title="Skills"
      table="skills"
      primaryField="name"
      secondaryField="category"
      fields={[
        { key: 'name', label: 'Skill name', type: 'text' },
        { key: 'category', label: 'Category (e.g. Frontend, Backend, DevOps)', type: 'text' },
        { key: 'level', label: 'Level (1-5)', type: 'number' },
        { key: 'sort_order', label: 'Sort order', type: 'number' },
      ]}
    />
  )
}
