'use strict';

/**
 * Tooltip function to handle tooltip functionality
 * @param {HTMLElement} $element 
 */
export const Tooltip = function ($element) {
    const $tooltip = document.createElement('span');
    $tooltip.classList.add('tooltip', 'text-body-small');

    $element.addEventListener('mouseenter', function () {
        const tooltipText = this.dataset.tooltip;
        $tooltip.textContent = tooltipText;
        document.body.appendChild($tooltip);

        const rect = this.getBoundingClientRect();
        $tooltip.style.position = 'absolute';
        $tooltip.style.left = `${rect.left}px`;
        $tooltip.style.top = `${rect.bottom}px`;

        
    });

    $element.addEventListener('mouseleave', function () {
        if (document.body.contains($tooltip)) {
            document.body.removeChild($tooltip);
        }
    });
}
