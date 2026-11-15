import { Component, computed } from '@angular/core';
import { LucideDynamicIcon } from '@lucide/angular';
import { icons, IconName } from '../../icons/icons';
import { input } from '@angular/core';

@Component({
  selector: 'app-icon',
  imports: [LucideDynamicIcon],
  templateUrl: './icon.html',
  styleUrl: './icon.css',
})
export class Icon {
  readonly name = input.required<IconName>();
  readonly icon = computed(() => icons[this.name()]);
}
