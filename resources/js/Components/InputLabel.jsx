export default function InputLabel({ value, className = '', children, ...props }) {
    return (
        <label {...props} className={`block font-bold text-sm text-gray-300 uppercase tracking-wide mb-2 ` + className}>
            {value ? value : children}
        </label>
    );
}