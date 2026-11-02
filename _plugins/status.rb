# One "status" field for projects and blogs, set in the front matter.
#
#   status: done    (default) visible everywhere
#   status: wip     visible, with a work in progress banner and card badge
#   status: draft   only visible in local builds (jekyll serve), left out of the live site
#   status: hidden  never built, in any environment
#
# Documents that shouldn't be built are removed from their collection before anything renders,
# so they also disappear from listings, the sidebar, the footer, search and the sitemap.
# This works because the site is built by GitHub Actions, which runs plugins in _plugins.

module Portfolio
  class StatusFilter < Jekyll::Generator
    safe true
    priority :highest

    COLLECTIONS = %w[projects blogs].freeze
    STATUSES = %w[done wip draft hidden].freeze

    def generate(site)
      production = Jekyll.env == "production"

      COLLECTIONS.each do |name|
        collection = site.collections[name]
        next unless collection

        collection.docs.reject! do |doc|
          status = (doc.data["status"] || "done").to_s.strip.downcase

          unless STATUSES.include?(status)
            Jekyll.logger.warn "Status:", "#{doc.relative_path} has unknown status '#{status}', treating it as done"
            status = "done"
          end

          doc.data["status"] = status
          status == "hidden" || (status == "draft" && production)
        end
      end
    end
  end
end
