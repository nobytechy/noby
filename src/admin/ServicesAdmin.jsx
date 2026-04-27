import SimpleCrud from './SimpleCrud'

export default function ServicesAdmin() {
  return (
    <SimpleCrud
      title="Services"
      table="services"
      primaryField="title"
      secondaryField="description"
      fields={[
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'icon', label: 'Icon name (lucide, e.g. "code")', type: 'text' },
        { key: 'sort_order', label: 'Sort order', type: 'number' },
      ]}
    />
  )
}
