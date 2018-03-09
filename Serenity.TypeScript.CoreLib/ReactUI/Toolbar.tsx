﻿namespace Serenity {
    export interface ToolButton {
        title?: string;
        hint?: string;
        cssClass?: string;
        icon?: string;
        onClick?: any;
        htmlEncode?: any;
        hotkey?: string;
        hotkeyAllowDefault?: boolean;
        hotkeyContext?: any;
        separator?: boolean;
        disabled?: boolean;
    }

    export interface ToolbarOptions {
        buttons?: ToolButton[];
        hotkeyContext?: any;
    }

    export namespace UI {

        @Decorators.registerClass("Serenity.UI.ToolButton")
        export class ToolButton extends React.Component<Serenity.ToolButton> {

            static buttonSelector = "div.tool-button";

            static adjustIconClass(icon: string): string {
                if (!icon)
                    return icon;

                if (Q.startsWith(icon, 'fa-'))
                    return 'fa ' + icon;

                if (Q.startsWith(icon, 'glyphicon-'))
                    return 'glyphicon ' + icon;

                return icon;
            }

            static className(btn: Serenity.ToolButton) {
                return Q.cssClass({
                    "tool-button": true,
                    "icon-tool-button": !!btn.icon,
                    "no-text": !btn.title,
                    disabled: btn.disabled,
                    [btn.cssClass]: !!btn.cssClass,
                });
            }

            handleClick(e: React.MouseEvent<any>) {
                if (!this.props.onClick || $(e.currentTarget).hasClass('disabled'))
                    return;

                this.props.onClick(e);
            }

            render() {
                return (
                    <div className={ToolButton.className(this.props)} title={this.props.hint}
                        onClick={(e) => this.handleClick(e)}>
                        <div className="button-outer">
                            {this.renderButtonText()}
                        </div>
                    </div>
                );
            }

            renderButtonText() {
                var btn = this.props;
                var klass = ToolButton.adjustIconClass(btn.icon);
                if (!klass && !btn.title)
                    return <span className="button-inner"></span>;

                if (!btn.htmlEncode) {
                    var h = (klass ? '<i class="' + Q.attrEncode(klass) + '"></i> ' : '') + btn.title;
                    return (<span className="button-inner" dangerouslySetInnerHTML={{ __html: h }}></span>);
                }

                if (!klass)
                    return <span className="button-inner">{btn.title}</span>

                return <span className="button-inner"><i className={klass} ></i>{btn.title}</span>
            }
        }

        export class IntraToolbar extends React.Component<Serenity.ToolbarOptions> {

            public el: Element;
            protected mouseTrap: any;

            setupMouseTrap() {
                if (!window['Mousetrap'])
                    return;

                var buttons;
                for (var b of (this.props.buttons || [])) {
                    if (Q.isEmptyOrNull(b.hotkey))
                        continue;

                    this.mouseTrap = this.mouseTrap || window['Mousetrap'](
                        this.props.hotkeyContext || window.document.documentElement);

                    ((x) => {
                        var btn = (buttons = buttons || $(this.el).find(UI.ToolButton.buttonSelector))
                            .filter("." + x.cssClass);

                        this.mouseTrap.bind(x.hotkey, function (e: BaseJQueryEventObject, action: any) {
                            if (btn.is(':visible')) {
                                btn.click();
                            }
                            return x.hotkeyAllowDefault;
                        });
                    })(b);
                }
            }

            componentDidMount() {
                this.setupMouseTrap();
            }

            componentWillUnmount() {
                $(this.el).find(UI.ToolButton.buttonSelector).unbind('click');
                if (this.mouseTrap) {
                    if (!!this.mouseTrap.destroy) {
                        this.mouseTrap.destroy();
                    }
                    else {
                        this.mouseTrap.reset();
                    }

                    this.mouseTrap = null;
                }
            }

            render() {
                return (
                    <div className="tool-buttons" ref={el => this.el = el}>
                        <div className="buttons-outer">
                            {this.renderButtons(this.props.buttons || [])}
                            {this.props.children}
                        </div>
                    </div>
                );
            }

            renderButtons(buttons: Serenity.ToolButton[]) {
                var result: JSX.Element[] = [];
                for (var btn of buttons) {
                    if (btn.separator)
                        result.push(<div className="separator" key={result.length} />);

                    result.push(<UI.ToolButton {...btn} key={result.length} />);
                }

                var key = 0;
                return (<div className="buttons-inner">
                    {result.map(x => { x.key = ++key; return x; })}
                    {this.props.children}
                </div>);
            }
        }

        @Decorators.registerClass("Serenity.UI.Toolbar")
        export class Toolbar extends IntraToolbar {
            render() {
                return (
                    <div className="s-Toolbar clearfix">
                        {super.render()}
                    </div>
                );
            }
        }
    }
}