---
title: Installer walkthrough
description: Step through the Vacti OS installer on both the headless and GUI SKUs, with the Vacti-specific answers the preseed fixes for you.
sidebar:
  order: 3
---

Once the machine boots the ISO, the install path depends on the SKU. The
**headless** SKU runs a preseeded debian-installer that answers most screens for
you. The **GUI** SKU boots a live XFCE desktop from which you launch the
graphical Calamares installer. Both produce the same installed engine.

This page walks the screens and calls out the answers that are specific to Vacti,
so you know what is decided for you and what you still provide.

## The Vacti-specific answers

The headless SKU's debian-installer is preseeded. That means these choices are
made ahead of time and you are not prompted for them:

- **Local administrator account.** A non-root sudo user is created as the
  appliance's non-public local administrator account.
- **No root login.** Direct root login is disabled. You administer the box through
  that account with `sudo`.
- **Password is preseeded.** The installer does not prompt for a password; it is
  set from the preseed. The account is non-public — for console or SSH access,
  request credentials from your Vacti licensing contact.
- **Locale and keyboard:** `en_US.UTF-8` and a US keymap.
- **Time zone:** UTC, with the hardware clock set to UTC.
- **Networking:** DHCP on the first available interface. The hostname is set to
  `vacti-engine` initially; the real hostname is settled at enroll time.
- **Partitioning:** guided, full-disk, a single ext4 root plus swap.
- **Boot loader:** GRUB installed to the EFI system partition under UEFI, or to
  the disk under legacy BIOS.

No enrollment token and no control-plane URL are preseeded. Those are supplied
live at first boot, never baked. See
[Post-install and enrollment](/install-iso/04-post-install-enroll/).

## Headless SKU: the preseeded debian-installer

On the headless SKU the installer is unattended except for the password. The
flow is:

1. **Boot.** The GRUB (UEFI) or isolinux (BIOS) menu auto-boots its default
   entry after a short countdown, or press `Enter` to start now. This is a
   text-mode install over the console (and, if present, the serial line).
2. **Automatic setup.** Locale, keyboard, network (DHCP), clock (UTC), and the
   `vacti-engine` hostname are applied from the preseed with no prompts.
3. **Set the `vacti` password.** This is the one interactive prompt. Type a
   strong password for the `vacti` account and confirm it. A weak password is
   refused; enter a stronger one and continue. The username is already fixed to
   `vacti` and root login is already disabled, so you are not asked about either.
4. **Disk and partitioning.** Guided full-disk partitioning runs automatically:
   a single ext4 root plus swap on the target disk. The installer writes the new
   partition table and confirms the overwrite from the preseed.

   > Caution: guided full-disk partitioning uses the whole target disk. Make sure
   > you booted on the machine you intend to install to and that nothing on its
   > disk needs keeping.
5. **Base system and packages install.** The engine image contents are laid down
   from the ISO.
6. **Boot loader install.** GRUB is installed to the ESP (UEFI) or the disk
   (BIOS).
7. **Finish and reboot.** The installer enables the first-boot enrollment unit on
   the installed system, then reboots. Remove the USB stick (or detach the ISO)
   so the machine boots from its disk.

## GUI SKU: the live desktop and Calamares

On the GUI SKU the ISO boots into a live XFCE session, and you install to disk
with the graphical Calamares installer.

1. **Boot the live session.** GRUB (or isolinux on amd64 BIOS) auto-boots into a
   live XFCE desktop. You can explore the live environment before installing.
2. **Launch the installer.** Start Calamares (the install-to-disk installer) from
   the desktop. It is a standard graphical wizard with a page per step.
3. **Location and keyboard.** Confirm region, time zone, and keyboard layout.
4. **Partitioning.** Choose how to use the disk. For a dedicated Vacti box, the
   simplest choice is to erase the disk and let the installer partition it; for
   anything else, use manual partitioning. As with the headless flow, erasing the
   disk destroys everything on it, so confirm the target.
5. **Create the account.** Calamares prompts for the account name and password.
   Use `vacti` as the username to match the preseeded convention used across the
   fleet and the rest of this documentation, and set a strong password. Keep the
   "require a password to log in" and administrator (sudo) options enabled; do
   not enable automatic login.
6. **Review and install.** Confirm the summary and start the install. Calamares
   copies the live system to disk and installs the boot loader.
7. **Reboot.** When it finishes, reboot and remove the install media. The
   first-boot enrollment flow (here, the pre-login activation kiosk) runs on the
   next boot.

## After the installer

Whichever SKU you used, the installed system reboots into first-boot enrollment.
The engine will not run until the box is enrolled, and no token is baked, so you
provide the control-plane URL and license token live.

Continue to [Post-install and enrollment](/install-iso/04-post-install-enroll/).
