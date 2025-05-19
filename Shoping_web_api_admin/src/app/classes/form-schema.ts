import { SelectItem } from 'primeng/api';

export class FormSchemaItem {
    controlType: 'text' | 'editor' | 'textarea' | 'datetime' | 'dropdown' | 'user-picker' | 'autocomplete'
        | 'switch' | 'checkboxlist' | 'radiobuttonlist' | 'upload' | 'fileManager' | 'number';
    field      : string;
    visible?   : boolean;
    validators?: {
        required? : boolean;
        maxLength?: number;
        minLength?: number;
    };

    label?: {
        text?     : string;
        style?    : string;
        align?    : string;
        gWidth    : number;
        mdWidth   : number;
        visible?  : boolean;
        textClass?: string
    };

    control: {
        defaultValue?: any;
        ngClass?     : '',
        style?       : any;

        placeholder: any;

        rows?: number;  // for textarea

        serviceUri?  : string;   // for dropdown
        displayField?: string;   // for dropdown
        valueField?  : string;   // for dropdown
        dataSource?  : any;      // for dropdown
        filter?      : boolean;  // for dropdown
        // completeMethod: () => void;  // for autocomplete

        items?: SelectItem[];  // for checkboxlist, radiobuttonlist

        gWidth : number;
        mdWidth: number;

        disabled?: boolean;

        multiple?: boolean;  // for dropdown, user-picker, upload
    };
}
