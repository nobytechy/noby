import SimpleCrud from './SimpleCrud'

export default function TestimonialsAdmin() {
  return (
    <SimpleCrud
      title="Testimonials"
      table="testimonials"
      primaryField="client_name"
      secondaryField="content"
      fields={[
        { key: 'client_name', label: 'Client name', type: 'text' },
        { key: 'client_role', label: 'Role', type: 'text' },
        { key: 'client_company', label: 'Company', type: 'text' },
        { key: 'avatar_url', label: 'Avatar', type: 'image' },
        { key: 'content', label: 'Quote', type: 'textarea' },
        { key: 'rating', label: 'Rating (1-5)', type: 'number' },
        { key: 'sort_order', label: 'Sort order', type: 'number' },
      ]}
    />
  )
}
