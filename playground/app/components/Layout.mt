style
  .link
    @extends btn, btn-link, text-primary
  .header
    @extends header
  .footer
    @extends footer
  .container
    @extends container

component
  script
    const {config} = useConfig()
    const {params} = useRoute()

  header.header
    a.logo Site

    if child.headerContent
      child headerContent

    .links
      for link in config.header.links
        a.link(href=href key=href)= title

  .container
    children

  footer.footer
    .copywrite © Site

    if child.footerContent
      child footerContent

    .links
      for link in config.footer.links
        a.link(href=href key=href)= title
