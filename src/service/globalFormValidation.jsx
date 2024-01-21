import { useEffect } from 'react';

const globalFormValidation = () => {
    useEffect(() => {
        const forms = document.querySelectorAll('.needs-validation');

        const handleSubmit = (event) => {
            const form = event.currentTarget;

            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }

            form.classList.add('was-validated');
        };

        Array.from(forms).forEach((form) => {
            form.addEventListener('submit', handleSubmit, false);
        });

        // Cleanup event listeners on component unmount
        return () => {
            Array.from(forms).forEach((form) => {
                form.removeEventListener('submit', handleSubmit, false);
            });
        };
    }, []); // Empty dependency array ensures this effect runs only once on component mount
};

export default globalFormValidation;