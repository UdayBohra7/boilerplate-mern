import clsx from 'clsx';
import { FieldError } from 'react-hook-form';
import { FieldWrapper, FieldWrapperPassThroughProps } from './FieldWrapper';

type TagInputProps = FieldWrapperPassThroughProps & {
    value: string[];
    onChange: (tags: string[]) => void;
    className?: string;
    placeholder?: string;
    prefix?: string;
    error?: FieldError | undefined;
};

export const TagInput = (props: TagInputProps) => {
    const {
        label,
        value = [],
        onChange,
        className,
        error,
        placeholder,
        prefix = '#',
    } = props;

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const val = e.currentTarget.value.trim();
            if (val && !value.includes(val)) {
                onChange([...value, val]);
                e.currentTarget.value = '';
            }
        }
    };

    const removeTag = (index: number) => {
        onChange(value.filter((_, i) => i !== index));
    };

    return (
        <FieldWrapper label={label} error={error}>
            <div
                className={clsx(
                    'form-control',
                    error?.message && 'is-invalid',
                    className
                )}
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    padding: '8px 12px',
                    minHeight: '45px',
                    alignItems: 'center',
                    height: 'auto',
                }}
            >
                {value.map((tag, index) => (
                    <span
                        key={index}
                        style={{
                            background: '#E9ECEF',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                        }}
                    >
                        {prefix}{tag}
                        <i
                            className="fa-solid fa-times"
                            style={{ cursor: 'pointer', fontSize: '10px' }}
                            onClick={() => removeTag(index)}
                        ></i>
                    </span>
                ))}
                <input
                    type="text"
                    placeholder={value.length === 0 ? placeholder || 'Add tags (press Enter)' : ''}
                    style={{
                        border: 'none',
                        outline: 'none',
                        fontSize: '14px',
                        flex: 1,
                        background: 'transparent',
                        minWidth: '120px',
                        padding: 0,
                        margin: 0,
                    }}
                    onKeyDown={handleKeyDown}
                />
            </div>
        </FieldWrapper>
    );
};
