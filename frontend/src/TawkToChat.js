import { useEffect } from 'react';

const TawkToWidget = () => {
    useEffect(() => {
        // Ensure that Tawk_API is initialized correctly on the global window object.
        window.Tawk_API = window.Tawk_API || {};
        window.Tawk_LoadStart = new Date();

        // Create and append the script tag dynamically
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://embed.tawk.to/66ee62854cbc4814f7dc83d8/1i89j1nhg';
        script.charset = 'UTF-8';
        script.setAttribute('crossorigin', '*');

        // Insert the script before the first existing script tag on the page
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(script, firstScriptTag);

        return () => {
            // Cleanup the script when the component unmounts
            script.remove();
        };
    }, []);

    return null; // No visual output needed for this component
};

export default TawkToWidget;
