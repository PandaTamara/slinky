/*
 * Fork Slinky
 * Rather sweetmenus
 * @author Ali Zahid <ali.zahid@live.com>
 * @author fork Panda Tamara <link@mimika-team.ru>
 * @license MIT
 */

/**
 * Static constants
 */
const
    MAIN_CLASS = 'sm-wrap',
    HEADER_CLASS = 'sm-header',
    TITLE_CLASS = 'sm-title',
    NEXT_CLASS = 'sm-next',
    BACK_CLASS = 'sm-back';

class Slinky {

    // default options
    get options() {
        return {
            resize: true,
            speed: 300,
            theme: false,
            title: true,
            backLabelMarkup: '<label><i class="sm-back-icon"></i></label>',
            nextLabelMarkup: '<label>%title%<i class="sm-next-icon"></i></label>',
            mainClass: false,
            headerClass: false,
            backClass: false,
            titleClass: false,
            nextClass: false
        }
    }

    constructor(element, options = {}) {
        // save settings
        this.settings = {
            ...this.options,
            ...options
        }

        // let's go!
        this._init(element)
    }

    // setup the DOM just for us
    _init(element) {
        // the two elements of water and moisture
        this.menu = jQuery(element)
        this.base = this.menu.children().first()

        const {base, menu, settings} = this

        // set theme
        menu.addClass(MAIN_CLASS).addClass(settings.mainClass).addClass(settings.theme)

        // set transition speed
        this._transition(settings.speed)

        // create header item
        const header = jQuery('<li>').addClass(HEADER_CLASS).addClass(settings.headerClass)

        // prepend it to the list
        jQuery('li > ul', menu).prepend(header)

        // do we need to add titles?
        console.log(settings.title);
        if (settings.title) {
            // loop through each child list
            jQuery('li > ul', menu).each((index, element) => {
                // get the label from the parent link
                const label = jQuery(element)
                    .parent()
                    .find('a')
                    .first()

                console.log(label.text());
                console.log('--');

                // if it's not empty, create the title
                if (label) {
                    /*const title = jQuery('<header>')
                      .addClass(TITLE_CLASS)
                      .text(label)*/

                    const title = jQuery(label.attr('href') === '#' ? jQuery('<label>') : jQuery('<a>').attr('href', label.attr('href')))
                        .addClass(TITLE_CLASS)
                        .addClass(settings.titleClass)
                        .text(label.text())

                    //console.log(title);

                    // append it to the immediate header
                    // TODO use header var
                    jQuery('> .' + HEADER_CLASS, element).append(title)

                    //jQuery(header, element).append(title)

                }
            })

            console.log('-------');
        }



        // create back buttons
        const back =
            jQuery(settings.backLabelMarkup)
                .addClass(BACK_CLASS)
                .addClass(settings.backClass)

        // prepend them to the headers
        jQuery('.' + HEADER_CLASS, menu).prepend(back)

        // add arrows to links with children
        jQuery('a + ul', menu).each(function (i, el) {
            jQuery(el)
                .prev()
                .replaceWith(jQuery(settings.nextLabelMarkup.replace('%title%', jQuery(el).prev().text()))
                    .addClass(jQuery(el).prev().attr('class'))
                    .addClass(NEXT_CLASS)
                    .addClass(settings.nextClass)
                )

        });

        // add click listeners
        this._addListeners()

        // jump to initial active
        this._jumpToInitial()
    }

    // click listeners
    _addListeners() {
        const {menu, settings} = this

        jQuery('label', menu).on('click', e => {
            // prevent broken/half transitions
            if (this._clicked + settings.speed > Date.now()) {
                return false
            }

            // cache click time to check on next click
            this._clicked = Date.now()

            // get the link
            const link = jQuery(e.currentTarget)

            // time to move
            if (link.hasClass(BACK_CLASS)) {
                // and two steps back
                // just one step back, actually

                // make the move
                this._move(-1, () => {
                    // remove the current active
                    menu.find('.active').removeClass('active')

                    // set the new active
                    link
                        .parent()
                        .parent()
                        .hide()
                        .parentsUntil(menu, 'ul')
                        .first()
                        .addClass('active')
                })

                // resize the menu if need be
                if (settings.resize) {
                    this._resize(
                        link
                            .parent()
                            .parent()
                            .parentsUntil(menu, 'ul')
                    )
                }

            } else if (link.hasClass(NEXT_CLASS)) {
                // one step forward

                // remove the current active
                menu.find('.active').removeClass('active')

                // set the new active
                link
                    .next()
                    .show()
                    .addClass('active')

                // make the chess move
                this._move(1)

                // resize the menu if need be
                if (settings.resize) {
                    this._resize(link.next())
                }
            }

        })
    }

    // jump to initial active on init
    _jumpToInitial() {
        const {menu, settings} = this

        // get initial active
        const active = menu.find('.active')

        if (active.length > 0) {
            // remove initial active
            active.removeClass('active')

            // jump without animation
            this.jump(active, false)
        }

        // set initial height on the menu
        // to fix the first transition resize bug
        setTimeout(() => menu.height(menu.outerHeight()), settings.speed)
    }

    // slide the menu
    _move(depth = 0, callback = () => {
    }) {
        // don't bother packing if we're not going anywhere
        if (depth === 0) {
            return
        }

        const {settings, base} = this

        // get current position from the left
        const left = Math.round(parseInt(base.get(0).style.left)) || 0

        // set the new position from the left
        base.css('left', `${left - depth * 100}%`)

        // callback after the animation
        if (typeof callback === 'function') {
            setTimeout(callback, settings.speed)
        }
    }

    // resize the menu
    // to match content height
    _resize(content) {
        const {menu} = this

        menu.height(content.outerHeight())
    }

    // set the transition speed
    _transition(speed = 300) {
        const {menu, base} = this

        menu.css('transition-duration', `${speed}ms`)
        base.css('transition-duration', `${speed}ms`)
    }

    // jump to an element
    jump(target, animate = true) {
        if (!target) {
            return
        }

        const {menu, settings} = this

        const to = jQuery(target)

        // get all current active
        const active = menu.find('.active')

        // how many moves must we jump?
        let count = 0

        // this many
        // until we reach the parent list
        if (active.length > 0) {
            count = active.parentsUntil(menu, 'ul').length
        }

        // remove current active
        // hide all lists
        menu
            .find('ul')
            .removeClass('active')
            .hide()

        // get parent list
        const menus = to.parentsUntil(menu, 'ul')

        // show parent list
        menus.show()

        //
        to.show().addClass('active')

        // set transition speed to 0 if no animation
        if (!animate) {
            this._transition(0)
        }

        // make the checkers move
        this._move(menus.length - count)

        // resize menu if need be
        if (settings.resize) {
            this._resize(to)
        }

        // set transition speed to default after transition
        if (!animate) {
            this._transition(settings.speed)
        }
    }

    // go big or go home
    // just go home
    home(animate = true) {
        const {base, menu, settings} = this

        // set transition speed to 0 if no animation
        if (!animate) {
            this._transition(0)
        }

        // get current active
        const active = menu.find('.active')

        // get all parent lists
        const parents = active.parentsUntil(menu, 'ul')

        // make the move
        this._move(-parents.length, () => {
            // remove the current active
            active.removeClass('active').hide()

            // hide all parents except base
            parents.not(base).hide()
        })

        // resize if need be
        if (settings.resize) {
            this._resize(base)
        }

        // set transition speed back to default
        if (animate === false) {
            this._transition(settings.speed)
        }
    }

    // crush, kill, destroy
    destroy() {
        const {base, menu, settings} = this

        // remove all headers
        jQuery('.' + HEADER_CLASS, menu).remove()

        // remove Slinky links
        // and click listeners
        jQuery('a', menu)
            .removeClass('next')
            .off('click')

        // remove inline styles
        menu.css({
            height: '',
            'transition-duration': ''
        })

        base.css({
            left: '',
            'transition-duration': ''
        })

        // remove Slinky HTML
        jQuery('li > a > span', menu)
            .contents()
            .unwrap()

        // remove any current active
        menu.find('.active').removeClass('active')

        // remove any Slinky style classes
        const styles = menu.attr('class').split(' ')

        styles.forEach(style => {
            if (style.indexOf('slinky') === 0) {
                menu.removeClass(style)
            }
        })

        // reset fields
        const fields = ['settings', 'menu', 'base']

        fields.forEach(field => delete this[field])
    }
}

// jQuery plugin
;($ => {
    $.fn.slinky = function (options) {
        const menu = new Slinky(this, options)

        return menu
    }
})(jQuery)
