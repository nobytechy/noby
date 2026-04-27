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
        { key: 'icon', label: 'Icon key (web | mobile | fullstack)', type: 'text' },
        { key: 'price_from', label: 'Starting price (number)', type: 'number' },
        { key: 'price_unit', label: 'Currency / unit (USD)', type: 'text' },
        { key: 'sort_order', label: 'Sort order', type: 'number' },
      ]}
    />
  )
}
