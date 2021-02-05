style
  .section
    @extends flex1, wFull, pX4
  .row
    @extends pT5
    .header
      @extends textLg, fontSemibold, textGray600
    .content
      @extends textXl, pL2

mixin row(title, content)
  .row
    Text.header= title
    Text.content= content

component(logo, color, links)
  - const {params} = useRoute()

  ScrollView.section
    case params.platform
      when 'slack'
        +row('workspace', params.user.team_name)
        +row('username', `@${params.user.team_name}`)

      when 'discord'
        +row('name', `@${params.user.name}`)
