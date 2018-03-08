﻿namespace Serenity.UI {
    export interface PropertyFieldProps extends Serenity.PropertyItem {
        idPrefix?: string
        localTextPrefix?: string;
    }

    export class PropertyField extends React.Component<PropertyFieldProps> {

        protected text = Q.prefixedText(this.props.localTextPrefix);

        getCaption(): string {
            return this.text(this.props.title, this.props.name);
        }

        getHint(): string {
            var hint = this.text(this.props.hint, this.props.name + '_Hint');

            if (hint == null)
                return this.getCaption();

            return hint || null;
        }

        getPlaceHolder() {
            return this.text(this.props.placeholder, this.props.name + '_Placeholder');
        }

        getClassName() {
            var className = this.props.cssClass || "";

            if (!Q.isEmptyOrNull(this.props.formCssClass)) {
                className += (className ? " " : "") + this.props.formCssClass;
            }

            return className;
        }

        getHtmlFor(editorType: any) {
            var htmlFor;
            if ((editorType === RadioButtonEditor || editorType === BooleanEditor) &&
                (this.props.editorParams == null || !!!this.props.editorParams['labelFor'])) {
                htmlFor = null;
            }
            return htmlFor;
        }

        getEditorType() {
            return Serenity.EditorTypeRegistry
                .get(Q.coalesce(this.props.editorType, 'String')) as any;
        }

        getEditorId() {
            return (this.props.idPrefix || "") + (this.props.name || "");
        }

        getMaxLength() {
            return this.props.maxLength > 0 ? this.props.maxLength : null;
        }

        render() {
            var EditorType = this.getEditorType();

            return (
                <Field
                    className={this.getClassName()}
                    caption={this.getCaption()}
                    id={this.getEditorId()}
                    labelWidth={this.props.labelWidth}
                    htmlFor={this.getHtmlFor(EditorType)}
                    hint={this.getHint()}
                    required={this.props.required}
                    editor={ed => <EditorType {...ed}
                        maxlength={this.getMaxLength()}
                        {...this.props.editorParams}
                        setOptions={this.props.editorParams} />} />
            );
        }
    }
}