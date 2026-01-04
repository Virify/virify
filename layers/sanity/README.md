
# Sanity Layer (Content Studio)

The **Sanity Layer** provides a real-time content editing environment for Virify, powered by [Sanity Studio](https://www.sanity.io/). It is used for managing property content, CMS pages, and other structured data.

---

## 🏗️ What is Sanity?

Sanity Studio is an open-source, customizable content platform. In Virify, it is used for:
- Managing property and listing content
- Editing CMS pages and static content
- Providing a real-time collaborative editing experience

---

## 🚀 Setup

### Docker
- The Sanity Studio runs as a separate service in Docker Compose (`make up` starts it automatically)
- Access the studio at [http://localhost:3333](http://localhost:3333) (or configured port)

### Local
- Navigate to `layers/sanity/` and run:
	```bash
	pnpm install
	pnpm run dev
	```
- Access at [http://localhost:3333](http://localhost:3333)

---

## 🧩 Customization & Plugins
- Extend schemas in `layers/sanity/schemas/`
- Add plugins or custom input components as needed
- See [Sanity plugin docs](https://www.sanity.io/docs/content-studio/extending?utm_source=readme)

---

## 🔗 Further Reading
- [Sanity Getting Started](https://www.sanity.io/docs/introduction/getting-started?utm_source=readme)
- [Sanity Community](https://www.sanity.io/community/join?utm_source=readme)
