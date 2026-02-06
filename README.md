## Getting Started

As we know, deployments are automated to Vercel, but we should always push our code to the **development** branch first because there may be build errors.

From the development branch, create your own branch and then open a pull request. Vercel will run the build, and if it succeeds, the changes can be merged into **development**.

We will only merge to **main** after careful consideration.

---

## Tailwind CSS Note for Team Mates

<p style="color:red;"><strong>Important:</strong> Tailwind CSS is mobile-first. This means styles are applied to mobile screens by default, and larger screen styles are added using breakpoints like <code>sm:</code>, <code>md:</code>, <code>lg:</code>, and <code>xl:</code>.</p>

### Examples

**Example 1: Text size**

```html
<p class="text-sm md:text-lg">
  Small text on mobile, larger text on medium screens and above.
</p>
```

**Example 2: Flex direction**

```html
<div class="flex flex-col md:flex-row">
  <!-- Column on mobile, row on medium screens and above -->
</div>
```

**Example 3: Padding**

```html
<div class="p-2 md:p-6">
  <!-- Small padding on mobile, larger padding on medium screens and above -->
</div>
```

### Rule to Remember

* Default classes → Mobile
* `sm:` → Small screens and up
* `md:` → Tablets and up
* `lg:` → Laptops and up
* `xl:` → Large desktops
