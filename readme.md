# Slinky fork

Rather sweet menus. A light-weight, responsive, mobile-like navigation menu plugin

This fork based by slinky plugin ([Demo](https://alizahid.github.io/slinky/))

### Base diffs

1. More options for customisations
2. Removed height jumping

### Install

Include these files

	<script src="bower_components/slinky/dist/slinky.min.js"></script>
	<link rel="stylesheet" src="bower_components/slinky/dist/slinky.min.css">

## Usage

    const slinky = $('.menu').slinky(options)

## Options

Option | Default | Description
------ | ------- | -----------
`resize` | `true` | Resize menu height to match content on navigation
`speed` | `300` | Animation speed in `milliseconds`
`theme` | `slinky-theme-default` | Slinky theme
`backLabelMarkup` | `<label><i class="sm-back-icon"></i></label>` | Markup of back button
`nextLabelMarkup` | `<label>%title%<i class="sm-next-icon"></i></label>` | Markup of next button, %title% will be replaced to href text
`mainClass` | `false` | String with classes for root element
`headerClass` | `false` | String with classes for header
`nextClass` | `false` | String with classes for next button
`backClass` | `false` | String with classes for back button



## API

### .home(`animate`)

Navigate back to the root menu

Option | Default value | Description
------ | ------------- | -----------
`animate` | `true` | Pass `false` to skip animation

### .jump(`target`, `animate`)

Navigate to a sub menu

Option | Default value | Description
------ | ------------- | -----------
`to` |  | Selector for `ul` target to jump to
`animate` | `true` | Pass `false` to skip animation

### .destroy()

Remove Slinky

## Tips

- Set `.active` on a `ul` element to jump there on init
